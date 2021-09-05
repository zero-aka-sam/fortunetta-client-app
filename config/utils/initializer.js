const initializeMethods = async (contract, methods) => {

      let dataKeys = []

      await methods?.map(async (method) => {
        const dataKey = await contract.methods[method].cacheCall()
        dataKeys.push(dataKey)
      })
      const lastDataKey = dataKeys.filter((dataKey,index) => {
            return  index === (dataKeys.length - 1)
      })

      return lastDataKey[0]
}

const Initializer = {
    methods : initializeMethods
}
    
export default Initializer