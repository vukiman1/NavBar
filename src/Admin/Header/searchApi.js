// Mock data for search results
const mockUsers = [
    { id: 1, name: "Nguyễn Văn A", description: "Admin", type: "user" },
    { id: 2, name: "Trần Thị B", description: "HR Manager", type: "user" },
    { id: 3, name: "Lê Văn C", description: "Developer", type: "user" },
    { id: 4, name: "Phạm Thị D", description: "Marketing", type: "user" },
    { id: 5, name: "Hoàng Văn E", description: "Sales", type: "user" },
  ]
  
  const mockCompanies = [
    { id: 1, name: "Công ty TNHH ABC", description: "Công nghệ thông tin", type: "company" },
    { id: 2, name: "Tập đoàn XYZ", description: "Tài chính - Ngân hàng", type: "company" },
    { id: 3, name: "Công ty CP DEF", description: "Bất động sản", type: "company" },
    { id: 4, name: "Tổ chức GHI", description: "Giáo dục", type: "company" },
    { id: 5, name: "Doanh nghiệp JKL", description: "Thương mại điện tử", type: "company" },
  ]
  
  const mockJobPosts = [
    { id: 1, name: "Tuyển dụng Frontend Developer", description: "Công ty TNHH ABC - Hà Nội", type: "jobpost" },
    { id: 2, name: "Vị trí Backend Developer", description: "Tập đoàn XYZ - TP.HCM", type: "jobpost" },
    { id: 3, name: "Tuyển UI/UX Designer", description: "Công ty CP DEF - Đà Nẵng", type: "jobpost" },
    { id: 4, name: "Cần tuyển HR Manager", description: "Tổ chức GHI - Hà Nội", type: "jobpost" },
    { id: 5, name: "Vị trí Product Manager", description: "Doanh nghiệp JKL - TP.HCM", type: "jobpost" },
  ]
  
  /**
   * Search for entities (users, companies, job posts) based on a query string
   * @param {string} query - The search query
   * @returns {Promise<Array>} - Promise resolving to an array of search results
   */
  export const searchEntities = async (query) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    if (!query || query.trim() === "") {
      return []
    }
  
    const normalizedQuery = query.toLowerCase().trim()
  
    // Filter entities based on the query
    const filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedQuery) || user.description.toLowerCase().includes(normalizedQuery),
    )
  
    const filteredCompanies = mockCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.description.toLowerCase().includes(normalizedQuery),
    )
  
    const filteredJobPosts = mockJobPosts.filter(
      (jobPost) =>
        jobPost.name.toLowerCase().includes(normalizedQuery) ||
        jobPost.description.toLowerCase().includes(normalizedQuery),
    )
  
    // Combine and sort results
    // We'll prioritize exact matches in names, then partial matches in names, then matches in descriptions
    const combinedResults = [...filteredUsers, ...filteredCompanies, ...filteredJobPosts]
  
    // Sort results by relevance
    combinedResults.sort((a, b) => {
      // Exact match in name
      const aExactMatch = a.name.toLowerCase() === normalizedQuery
      const bExactMatch = b.name.toLowerCase() === normalizedQuery
  
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1
  
      // Starts with query
      const aStartsWith = a.name.toLowerCase().startsWith(normalizedQuery)
      const bStartsWith = b.name.toLowerCase().startsWith(normalizedQuery)
  
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
  
      // Contains query in name
      const aContainsInName = a.name.toLowerCase().includes(normalizedQuery)
      const bContainsInName = b.name.toLowerCase().includes(normalizedQuery)
  
      if (aContainsInName && !bContainsInName) return -1
      if (!aContainsInName && bContainsInName) return 1
  
      // Alphabetical order as fallback
      return a.name.localeCompare(b.name)
    })
  
    // Limit results to avoid overwhelming the UI
    return combinedResults.slice(0, 10)
  }
  
  