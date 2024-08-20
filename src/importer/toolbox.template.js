/* LOCAL->> */
const categoryCallbacks = {
  'TOOLBOX_CATEGORY': () => { }
}
/* <<-LOCAL */

export const registerToolboxCallbacks = workspace => {
  for (const [categoryName, categoryCallback] of Object.entries(categoryCallbacks)) {
    workspace.registerToolboxCategoryCallback(categoryName, categoryCallback)
  }
}
