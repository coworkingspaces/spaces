package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/MontFerret/ferret/pkg/compiler"
	"github.com/MontFerret/ferret/pkg/drivers"
	"github.com/MontFerret/ferret/pkg/drivers/cdp"
	"github.com/MontFerret/ferret/pkg/drivers/http"
	"github.com/MontFerret/ferret/pkg/runtime"
)

type CoWorkingSpace struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	URL         string `json:"url"`
}

func getCoWorkingSpacesList() ([]*CoWorkingSpace, error) {
	query := `
		LET google = DOCUMENT("https://www.google.com/", {
				driver: "cdp",
				userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36"
		})

		// accept cookies
		CLICK(google, '#L2AGLb')
		WAIT(RAND(100))

		HOVER(google, 'textarea[name="q"]')
		WAIT(RAND(100))
		INPUT(google, 'textarea[name="q"]', @criteria, 10)
		WAIT(RAND(100))
		CLICK(google, 'input[name="btnK"]')

		WAITFOR EVENT "navigation" IN google

		WAIT_ELEMENT(google, "#res")

		LET results = ELEMENTS(google, "#res .g")

		FOR el IN results
				RETURN {
						title: INNER_TEXT(el, "h3"),
						description: INNER_TEXT(el, X("//em/parent::*")),
						url: ELEMENT(el, 'a')?.attributes.href
				}
				`

	comp := compiler.New()

	program, err := comp.Compile(query)
	if err != nil {
		return nil, err
	}

	// create a root context
	ctx := context.Background()

	// enable HTML drivers
	// by default, Ferret Runtime does not know about any HTML drivers
	// all HTML manipulations are done via functions from standard library
	// that assume that at least one driver is available
	ctx = drivers.WithContext(ctx, cdp.NewDriver(cdp.WithAddress("http://127.0.0.1:9222")))
	ctx = drivers.WithContext(ctx, http.NewDriver(), drivers.AsDefault())

	out, err := program.Run(ctx, runtime.WithParam("criteria", "coworking space in kiel"))
	if err != nil {
		return nil, err
	}

	res := make([]*CoWorkingSpace, 0, 10)

	err = json.Unmarshal(out, &res)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func main() {
	spaces, err := getCoWorkingSpacesList()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for _, topic := range spaces {
		fmt.Println(fmt.Sprintf("%s: %s %s", topic.Name, topic.Description, topic.URL))
	}
}
