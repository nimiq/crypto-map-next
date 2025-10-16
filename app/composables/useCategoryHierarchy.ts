/**
 * Filters an array of categories to return only the leaf nodes (most specific categories).
 * Removes any parent categories if their children are present in the array.
 *
 * For example: ['restaurant', 'italian_restaurant', 'pizza_restaurant', 'sandwich_shop']
 * Returns: ['pizza_restaurant', 'sandwich_shop']
 * (Removes 'restaurant' and 'italian_restaurant' because their children are present)
 */
export function useCategoryHierarchy() {
  /**
   * Fetches category hierarchies and filters the given categories to only leaf nodes
   */
  async function getLeafCategories(categoryIds: string[]): Promise<string[]> {
    if (categoryIds.length === 0)
      return []
    if (categoryIds.length === 1)
      return categoryIds

    try {
      // Fetch hierarchy relationships for the given categories
      const { data } = await useFetch('/api/categories/hierarchy', {
        query: { categories: categoryIds.join(',') },
      })

      if (!data.value?.hierarchies) {
        return categoryIds
      }

      // Build a set of parent IDs (categories that have children in this set)
      const parentIds = new Set(
        data.value.hierarchies
          .filter(h => categoryIds.includes(h.childId))
          .map(h => h.parentId),
      )

      // Return categories that are NOT parents (leaf nodes)
      return categoryIds.filter(id => !parentIds.has(id))
    }
    catch (error) {
      console.error('Failed to fetch category hierarchies:', error)
      return categoryIds
    }
  }

  return {
    getLeafCategories,
  }
}
