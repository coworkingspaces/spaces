import requests
from mlscraper.html import Page
from mlscraper.samples import Sample, TrainingSet
from mlscraper.training import train_scraper

def get_page_content(url):
  resp = requests.get(url)
  assert resp.status_code == 200
  return resp.content

def get_google_scraper():
    train_url = 'https://www.google.com/search?q=coworking+spaces+in+kiel'
    content = get_page_content(train_url)
    print(content)
    page = Page(content)
    training_set = TrainingSet()
    training_set.add_sample(Sample(page, {'name': 'FLEET7 - Coworking in Kiel', 'url': 'https://www.fleet7.de'}))
    training_set.add_sample(Sample(page, {'name': 'Legienstraße 40 | Kiel: Coworking', 'url': 'https://www.cobl.opencampus.sh/'}))
    training_set.add_sample(Sample(page, {'name': 'Cowork Nord - Cowork Nord', 'url': 'https://coworknord.de/'}))
    scraper = train_scraper(training_set)
    return scraper

def extract_coworking_spaces_urls(scraper, url):
    content = get_page_content(url)
    return scraper.get(Page(content))

def extract_coworking_space(page_content):
    pass

def save_coworking_space(coworking_space):
    pass

def main():
    start_url = "https://www.google.com/search?q=coworking+spaces+in+kiel"
    coworking_spaces_urls = extract_coworking_spaces_urls(get_google_scraper(), start_url)

    print(coworking_spaces_urls)

    # for url in coworking_spaces_urls:
    #     page_content = get_page_content(url)
    #     coworking_space = extract_coworking_space(page_content)
    #     save_coworking_space(coworking_space)

if __name__ == '__main__':
    main()