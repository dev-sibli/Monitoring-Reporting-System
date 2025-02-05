import banks from './banks.json'
import branches from './branches.json'

export async function searchBanks(query: string): Promise<string[]> {
  // Simulating an async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = banks.filter(bank => 
        bank.toLowerCase().includes(query.toLowerCase())
      )
      resolve(results)
    }, 300)
  })
}

export async function searchBranches(query: string): Promise<string[]> {
  // Simulating an async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = branches.filter(branch => 
        branch.toLowerCase().includes(query.toLowerCase())
      )
      resolve(results)
    }, 300)
  })
}

