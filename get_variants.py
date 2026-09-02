import urllib.request, json

url = "https://1fieuf-bz.myshopify.com/products.json?limit=250"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read())
    
    for p in data.get('products', []):
        print(f"{p['title']}:::{p['variants'][0]['id']}")
except Exception as e:
    print(f"Error: {e}")
