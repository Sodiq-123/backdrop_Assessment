# backdrop_Assessment

## Levenshtein Distance vs Damerau-Levenshtein Distance Algorithm

The pure Levenshtein Distance algorithm may be a more effective solution than the broader Damerau-Levenshtein Distance algorithm in scenarios where it's important to measure the exact number of edits needed to transform one string into another.

### Why use Levenshtein Distance Algorithm

The Levenshtein Distance algorithm gives more weight to the number of insertions, deletions, and substitutions, which are the most common types of errors in text data. This makes it a better choice when dealing with simple typos or misspellings.

### Why Damerau-Levenshtein Distance Algorithm may be less effective

The Damerau-Levenshtein Distance algorithm also considers transpositions, which may not be relevant in some scenarios. It may unnecessarily penalize transpositions, leading to less accurate results in certain scenarios.

In summary, it's important to understand the specific needs of the problem at hand before deciding which algorithm to use but in our usecase we used the Levenshtein Distance Algorithm for obvious reasons.