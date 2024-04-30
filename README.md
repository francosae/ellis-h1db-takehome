![image](https://github.com/francosae/ellis-h1db-takehome/assets/69439997/fec9b8f3-c5a5-4366-8cbe-006dd3982b4c)

## Ellis H1DB Assessment

To solve the problem, I chose elastisearch because of its text search capabilties, and from researching technoplogies it seemed to be the perfect fit to handle quick search responses and handling super large datasets. 

I preprocessed the data to add a 'normalized' name column for each employer

I know that it wasn't required to make an app but as I started to think of how I would go about implementing the requirments I wanted to do it for myself because I've never worked with elastisearch or flask before this

Overview:
- main.py is where I'm taking care of data preprocessing and normalization: I decided on this because of the nature of the problem which has to deal with inconsitenceis within the H1B dataset, to be specific the `EMPLOYER_NAME` was inconsistent.
Also by pre-processing the data it made the search a bit more efficient and increases the accuracy of results

- indexing.py is where i tried to optimize the search for both performanec and also relevance. The `CASE_NUMBER` field was indexed as a keyword for exact matches, and I spent effort with custom analyzers for the `EMPLOYER_NAME` field to handle some partial matches and variations, using tokenizers and filters.

- api.py here I have a pretty straight forward api to return query results with elastisearch, I also added some pagination too

- ui/.. I created a T3 app (Next.js, Tailwind CSS..) to make a simple interface where you fetch results and can search through pages 
