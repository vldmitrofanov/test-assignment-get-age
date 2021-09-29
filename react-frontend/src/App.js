import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [inputs, setInputs] = useState([''])
  const [res, setRes] = useState([])
  const [loading, setLoading] = useState(false)

  function handleChange(event, i) {
    const arr = [...inputs]
    arr[i] = event.target.value
    setInputs(arr)
  }
  function handleAddName() {
    if (inputs.length >= 16) return
    const arr = [...inputs]
    arr.push('')
    setInputs(arr)
  }
  function handleDelete(i) {
    const arr = [...inputs.filter((a, index) => i !== index)]
    setInputs(arr)
  }
  async function handleGetResults() {
    try {
      const filtered = inputs.filter((el) => el !== '')
      if (filtered.length == 0) {
        setRes([])
        return
      }
      setLoading(true)
      const string = 'names=' + filtered.join('&names=')
      const result = await axios.get(
        `https://localhost:5001/api/AgePredict?${string}`,
      )
      const arr = []
      if (filtered.length > 1)
        result.data.forEach((x) => {
          arr.push({ name: x.name, age: x.age })
        })
      else {
        const x = result.data
        arr.push({ name: x.name, age: x.age })
      }
      setRes(arr)
      console.log(arr)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <div className="query-form">
        <div className="form-group">
          {inputs.length > 0 &&
            inputs.map((inp, i) => (
              <label key={i}>
                Name:
                <input
                  type="text"
                  value={inputs[i]}
                  onChange={(e) => handleChange(e, i)}
                  required
                />
                {inputs.length > 1 && (
                  <button type="button" onClick={() => handleDelete(i)}>
                    Delete
                  </button>
                )}
              </label>
            ))}
        </div>
        <div className="button-group">
          <button type="button" onClick={handleAddName}>
            Add name
          </button>
          <button type="submit" disabled={loading} onClick={handleGetResults}>
            {loading ? 'Please Wait...' : 'Get results'}
          </button>
        </div>
      </div>
      {res.length > 0 && (
        <div className="query-result">
          {res.map((r,ind) => (
            <div className="row" key={`r${ind}`}>
              <span>{r.name}</span>
              <strong>{r.age}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
