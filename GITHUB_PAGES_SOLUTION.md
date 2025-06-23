# GitHub Pages URL Routing Solution

## The Problem
GitHub Pages doesn't support server-side redirects like Netlify's `_redirects` file. When users visit a direct URL like `https://okayabedin.github.io/how-old-is-me/02-03-2004/Sumiya`, GitHub Pages serves a 404 error instead of redirecting to the age calculator.

## The Solution
We use **client-side routing** with GitHub Pages' built-in 404.html fallback mechanism.

### How It Works

#### 1. Direct URL Access
User visits: `https://okayabedin.github.io/how-old-is-me/02-03-2004/Sumiya`

#### 2. GitHub Pages 404 Handling
- GitHub Pages can't find this route (no file at that path)
- Automatically serves `404.html` 
- This is GitHub Pages' built-in behavior for client-side routing

#### 3. 404.html Processing
```javascript
// Extracts date pattern from any GitHub Pages path
const pathParts = path.split('/').filter(part => part.length > 0);
// Finds: ['how-old-is-me', '02-03-2004', 'Sumiya']

const datePattern = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
// Matches: '02-03-2004'

// Redirects to: /how-old-is-me/index.html#/02-03-2004/Sumiya
```

#### 4. Index.html Hash Processing
```javascript
// Head script detects hash and ensures it's visible in URL bar
window.location.hash = '#/02-03-2004/Sumiya';
window.history.replaceState({}, '', newUrl);
```

#### 5. Form Auto-Population
```javascript
// script.js parses hash URL
parseUrlForDate(); // Returns: {day: 3, month: 2, year: 2004, name: 'Sumiya'}

// Auto-populates form and submits
document.getElementById('birthdate').value = '2004-02-03';
document.getElementById('name').value = 'Sumiya';
form.dispatchEvent(new Event('submit'));
```

#### 6. Final Result
- Browser URL shows: `https://okayabedin.github.io/how-old-is-me/index.html#/02-03-2004/Sumiya`
- Age calculation displays immediately
- Hash URL is visible and shareable
- No more "stuck at redirect" issues

### Key Files

#### `404.html` (GitHub Pages Router)
- Detects date patterns in any path
- Extracts repository name for proper GitHub Pages URLs
- Redirects to `index.html#/date/name`

#### `index.html` (Hash Handler)
- Head script ensures hash URLs are visible in browser bar
- Compatible with both local development and GitHub Pages paths
- Updates URL using `replaceState` for clean appearance

#### `script.js` (Form Controller)
- Parses hash URLs for date/name extraction
- Auto-populates and submits form
- Handles `hashchange` events for navigation

### Browser URL Examples

| User Types | Browser Shows | Result |
|------------|---------------|---------|
| `/02-03-2004/Sumiya` | `/index.html#/02-03-2004/Sumiya` | ✅ Auto-calculated age |
| `/12-25-1990/John` | `/index.html#/12-25-1990/John` | ✅ Auto-calculated age |
| `/05-15-2000` | `/index.html#/05-15-2000` | ✅ Auto-calculated age (no name) |

### Benefits
1. **Works with GitHub Pages** - No server-side redirects needed
2. **Hash URLs visible** - Users see the full shareable URL
3. **Immediate results** - No loading screens or stuck redirects  
4. **Backward compatible** - Works with existing hash URLs
5. **SEO friendly** - Clean URLs that resolve properly

### Testing
Use the included test files to verify:
- `github-pages-test.html` - Complete GitHub Pages flow simulation
- `url-verification-test.html` - Hash URL visibility verification
- `final-hash-test.html` - Direct URL to hash conversion test

The solution now works perfectly with GitHub Pages' static hosting limitations while providing a smooth user experience.
