import './App.css';

function App() {

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        // fetch('/some-api', { method: form.method, body: formData });

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <div className="App">
        
          <header className="App-header">
            <h1>React Gene Search Demo</h1>
          </header>

          <div className="gene-search-form">
            <form method="post" onSubmit={handleSubmit}>            

              <div className="form-element">
                <label>Genus:<br/>
                  <select name="genus">
                    <option value="any">-- any --</option>
                    <option value="Aeschynome">Aeschynome</option>
                    <option value="Arachis">Arachis</option>
                    <option value="Cajanus">Cajanus</option>
                  </select>
                </label>
              </div>

              <div className="form-element">
                <label>species:<br/>
                  <select name="species">
                    <option value="any">-- any --</option>
                    <option value="cardenasii">cardenasii</option>
                    <option value="duranensis">duranensis</option>
                    <option value="hypogaea">hypogaea</option>
                    <option value="ipaensis">ipaensis</option>
                    <option value="stenosperma">stenosperma</option>
                  </select>
                </label>
              </div>

              <div className="form-element">
                <label>accession:<br/>
                  <select name="strain">
                    <option value="any">-- any --</option>
                    <option value="Tifrunner">Tifrunner</option>
                  </select>
                </label>
              </div>

              <div className="form-element">
                <label>name / identifier:<br/>
                  <input name="nameOrIdentifier"/>
                </label>
              </div>

              <div className="form-element">
                <label>description:<br/>
                  <input name="description"/>
                </label>
              </div>

              <div className="form-element">
                <label>gene family identifier:<br/>
                  <input name="geneFamilyIdentifier"/>
                </label>
              </div>

              <div className="form-element">
                <br/>
                <button type="submit" className="submit">SUBMIT</button>
              </div>
              
            </form>
          </div>
        </div>
    );
}

export default App;
