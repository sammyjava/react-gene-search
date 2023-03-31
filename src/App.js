import { useState } from 'react';

import './App.css';
import { genusList, speciesList, strainList } from './arrays.js';

function App() {

    // selectors
    const [selectedGenus, setSelectedGenus] = useState("");
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [selectedStrain, setSelectedStrain] = useState("");
    // text input
    const [nameOrIdentifier, setNameOrIdentifier] = useState("");
    const [description, setDescription] = useState("");
    const [geneFamilyIdentifier, setGeneFamilyIdentifier] = useState("");
    // dependent selector lists
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [strainOptions, setStrainOptions] = useState([]);

    // handle form submission
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

        setSelectedGenus(formJson.genus);
        setSelectedSpecies(formJson.species);
        setSelectedStrain(formJson.strain);

        if (formJson.genus) {
            setSpeciesOptions(speciesList[formJson.genus]);
        }
            
    }

    function handleGenusSelection(e) {
        setSelectedGenus(e.target.value);
        setSpeciesOptions(speciesList[e.target.value]);
        setSelectedSpecies("");
        setSelectedStrain("");
    }

    function handleSpeciesSelection(e) {
        setSelectedSpecies(e.target.value);
        setStrainOptions(strainList[e.target.value]);
        setSelectedStrain("");
    }

    function handleStrainSelection(e) {
        setSelectedStrain(e.target.value);
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
                  <select name="genus" value={selectedGenus}
                          onChange={e => handleGenusSelection(e)}>
                    <option value="">-- any --</option>
                    {genusList.map((genus) => <option value={genus}>{genus}</option>)}
                  </select>
                </label>
              </div>
              <div className="form-element">
                <label>species:<br/>
                  <select name="species" value={selectedSpecies}
                          onChange={e => handleSpeciesSelection(e)}>
                    <option value="">-- any --</option>
                    {selectedGenus && (
                        speciesOptions.map((species) => <option value={species}>{species}</option>)
                    )}
                  </select>
                </label>
              </div>
              <div className="form-element">
                <label>accession:<br/>
                  <select name="strain" value={selectedStrain}
                          onChange={e => handleStrainSelection(e)}>
                    <option value="">-- any --</option>
                    {selectedSpecies && (
                        strainOptions.map((strain) => <option value={strain}>{strain}</option>)
                    )}
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
