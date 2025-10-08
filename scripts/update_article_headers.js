const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '..', 'articles');

// Track changes
const changes = [];
let totalProcessed = 0;
let totalUpdated = 0;

// Get all article files
function getAllArticleFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllArticleFiles(filePath, fileList);
    } else if (file.endsWith('.md') && file !== 'Config.md' && file !== '_template.md') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Extract section ID and order from file path
function extractFileInfo(filePath) {
  const parts = filePath.split(path.sep);
  const sectionFolder = parts[parts.length - 2]; // e.g., "01", "02", etc.
  const fileName = parts[parts.length - 1]; // e.g., "00_introduction.md"

  // Extract order from filename
  const orderMatch = fileName.match(/^(\d+)_/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : 0;

  // Section ID is the folder number
  const sectionId = sectionFolder;

  return { sectionId, order, fileName };
}

// Process a single article
function processArticle(filePath) {
  totalProcessed++;

  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(content);

  const { sectionId, order, fileName } = extractFileInfo(filePath);

  // Build expected title format
  const currentTitle = data.title || '';
  const titlePattern = new RegExp(`^${sectionId}-${order}\\.\\s+`);

  let needsUpdate = false;
  const updates = [];

  // Check title format
  if (!titlePattern.test(currentTitle)) {
    // Extract the base title (remove existing prefix if any)
    let baseTitle = currentTitle.replace(/^\d+-\d+\.\s+/, '');
    if (!baseTitle) {
      baseTitle = fileName.replace(/^\d+_/, '').replace(/\.md$/, '').replace(/_/g, ' ');
    }

    data.title = `${sectionId}-${order}. ${baseTitle}`;
    updates.push(`title: "${currentTitle}" -> "${data.title}"`);
    needsUpdate = true;
  }

  // Ensure order field matches
  if (data.order !== order) {
    updates.push(`order: ${data.order} -> ${order}`);
    data.order = order;
    needsUpdate = true;
  }

  // Check description
  if (!data.description) {
    updates.push('Added description field (empty)');
    data.description = '';
    needsUpdate = true;
  }

  // Check tags
  if (!data.tags || !Array.isArray(data.tags)) {
    updates.push('Added tags field (empty array)');
    data.tags = [];
    needsUpdate = true;
  }

  // Check author
  if (data.author !== 'Rain Hu') {
    updates.push(`author: "${data.author || ''}" -> "Rain Hu"`);
    data.author = 'Rain Hu';
    needsUpdate = true;
  }

  // Check date
  if (data.date !== '') {
    updates.push(`date: "${data.date || 'undefined'}" -> ""`);
    data.date = '';
    needsUpdate = true;
  }

  // Check draft
  if (data.draft !== true) {
    updates.push(`draft: ${data.draft} -> true`);
    data.draft = true;
    needsUpdate = true;
  }

  if (needsUpdate) {
    totalUpdated++;

    // Write updated file
    const newContent = matter.stringify(markdownContent, data);
    fs.writeFileSync(filePath, newContent, 'utf8');

    changes.push({
      file: path.relative(articlesDir, filePath),
      updates
    });
  }
}

// Main execution
try {
  const articleFiles = getAllArticleFiles(articlesDir);

  console.log(`Found ${articleFiles.length} articles to process...\n`);

  articleFiles.forEach(processArticle);

  // Print summary
  console.log('='.repeat(80));
  console.log('ARTICLE YAML HEADER UPDATE SUMMARY');
  console.log('='.repeat(80));
  console.log(`\nTotal articles processed: ${totalProcessed}`);
  console.log(`Total articles updated: ${totalUpdated}`);
  console.log(`Total articles unchanged: ${totalProcessed - totalUpdated}\n`);

  if (changes.length > 0) {
    console.log('DETAILED CHANGES:\n');
    changes.forEach(({ file, updates }) => {
      console.log(`\n${file}:`);
      updates.forEach(update => {
        console.log(`  - ${update}`);
      });
    });
  } else {
    console.log('No changes needed. All articles already conform to requirements.');
  }

  console.log('\n' + '='.repeat(80));

} catch (error) {
  console.error('Error processing articles:', error);
  process.exit(1);
}
