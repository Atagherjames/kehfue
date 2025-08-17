import axios from "axios"

const useFetch = (config) => {
  
  return new Promise((resolve, reject) => {
    axios.request(config).then(res => {
      const response = res.data
      resolve(response)
    }).catch(err => {
      let error = err?.response?.data || err
      reject(error)
    })
  })
}

export default useFetch