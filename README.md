# Web App project

(Lines # are not accurate as of 21/10/2024)

HTML (index.html) 5/5
1.  Line 1+
2.  Line 20
3.  Form: Line 57
    Link: Line 68
    Media: Line 49
4.  Table: Line 59
5.  Sections seperate the content

CSS (css/styles.css) 5/5
1.  Font-family: Line 2 
    Background-color: Line 8
2.  Id: Line 29 #welcome 
    Class: Line 48 .hidden
3.  Last lines (150+)
4.  Flex: Line 5 
    Grid: Line 14
5.  #Welcome uses grid to keep the welcome "banner" over rest of the body 

JavaScript Basics (script.js) 5/5
1.  Line 134 Button with 'click' event listener
2.  Event Listener: Line 186
    DOM manipulation: Line 188
3.  Array: Line 200 this.projects = []; 
    Object: Line 199 this.articles = articleContainer;
    Function: Line 230   async fetchRepoReadme(repo) {...}
4.  
    **FeaturedProjectCarousel Workflow**
    1. Fetch Repositories
    -> `fetchRepos()` -> GitHub API -> `data` (repo data)
    2. Loop Through Repositories
    -> Check Cache: `sessionStorage.getItem('repo-readme')`
        -> If cached: Use cached data
        -> If not cached: `fetchRepoReadme()` -> GitHub API -> `readmeData` (object)
    3. Add Project to DOM Tree
    -> `addProject()` 
        -> Create `<article>` element
        -> Parse `readmeData.content` into HTML
        -> Append to `#article-container`
5.  Line 1+

Asynchronous Operations (script.js) 5/5
1.  Timer: Line 286
2.  Fetch: Line 98
3.  Line 250 addProject(repo, readmeData) {...}
4.  Line 242
5.  Line 251-257