const Fuse = require('fuse.js');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/search-index.json', 'utf-8'));
const articles = data.articles; // Include all articles (including drafts)

console.log('Total articles:', articles.length);
console.log('');

// 查找包含 priority queue 的文章
const priorityArticles = articles.filter(a =>
  a.title.toLowerCase().includes('priority') ||
  a.tags.some(t => t.toLowerCase().includes('priority'))
);

console.log('Articles with "priority":', priorityArticles.length);
priorityArticles.forEach(a => {
  console.log('- Title:', a.title);
  console.log('  Tags:', a.tags);
  console.log('  Draft:', a.draft);
  console.log('');
});

// 測試 Fuse.js 搜尋
const fuse = new Fuse(articles, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'tags', weight: 0.3 },
    { name: 'description', weight: 0.15 },
    { name: 'excerpt', weight: 0.05 },
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 1,
  findAllMatches: true,
  isCaseSensitive: false,
});

console.log('=== Fuse.js Search Results ===');
const results = fuse.search('priority queue');
console.log('Found:', results.length, 'results');
results.slice(0, 5).forEach((r, i) => {
  console.log(`${i+1}. ${r.item.title} (score: ${r.score?.toFixed(3)})`);
});

console.log('\n=== Testing other searches ===');
['priority', 'queue', 'heap', 'Priority Queue'].forEach(query => {
  const r = fuse.search(query);
  console.log(`"${query}": ${r.length} results`);
  if (r.length > 0) {
    console.log(`  → ${r[0].item.title} (score: ${r[0].score?.toFixed(3)})`);
  }
});
