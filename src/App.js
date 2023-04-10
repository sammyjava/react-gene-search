import { useEffect, useState } from 'react';
import { GlidingBlink } from 'react-loading-indicators';
// import { genusList, speciesList, strainList } from './arrays.js';

function App() {

    // selector lists
    const [genusList, setGenusList] = useState([]);
    const [speciesList, setSpeciesList] = useState([]);
    const [strainList, setStrainList] = useState([]);
    
    // selectors
    const [selectedGenus, setSelectedGenus] = useState("");
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [selectedStrain, setSelectedStrain] = useState("");
    // text input
    const [identifier, setIdentifier] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [geneFamilyIdentifier, setGeneFamilyIdentifier] = useState("");
    // GraphQL response
    const [response, setResponse] = useState({});
    // genes array from response
    const [genes, setGenes] = useState(null)
    // loading flag
    const [loading, setLoading] = useState(false);

    // get the genus list from the start
    useEffect(() => {
        getGenusList();
    }, []);

    // get the genus List (run once at initial render)
    async function getGenusList() {
        const requestJson = {
            "operationName": "Organisms",
            "variables": {
                "size": 100,
            },
            "query": "query Organisms($size: Int) {  organisms(size: $size) {    genus  }}"
        };
        fetch(process.env.REACT_APP_GRAPHQL_URI, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(requestJson),
        })
            .then((response) => {
                return(response.json());
            })
            .then((responseJson) => {
                const genusList = [];
                responseJson.data.organisms.map((organism) => {
                    if (organism.genus && !genusList.includes(organism.genus)) {
                        genusList.push(organism.genus);
                    }
                });
                setGenusList(genusList);
                console.log(genusList);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // get the species list for a given genus
    async function getSpeciesList(genus) {
        const requestJson = {
            "operationName": "Organisms",
            "variables": {
                "genus": genus,
                "size": 100
            },
            "query": "query Organisms($size: Int, $genus: String) {  organisms(size: $size, genus: $genus) {    species  }}"
        }
        fetch(process.env.REACT_APP_GRAPHQL_URI, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(requestJson),
        })
            .then((response) => {
                return(response.json());
            })
            .then((responseJson) => {
                const speciesList = [];
                responseJson.data.organisms.map((organism) => {
                    if (organism.species && !speciesList.includes(organism.species)) {
                        speciesList.push(organism.species);
                    }
                });
                setSpeciesList(speciesList);
                console.log(speciesList);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function getStrainList(species) {
        const requestJson = {
            "operationName": "Strains",
            "variables": {
                "species": species,
                "size": 100
            },
            "query": "query Strains($species: String, $size: Int) {  strains(species: $species, size: $size) {    identifier  }}"
        }
        fetch(process.env.REACT_APP_GRAPHQL_URI, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(requestJson),
        })
            .then((response) => {
                return(response.json());
            })
            .then((responseJson) => {
                const strainList = [];
                responseJson.data.strains.map((strain) => {
                    strainList.push(strain.identifier);
                });
                setStrainList(strainList);
                console.log(strainList);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // query GraphQL and set appropriate state variables
    async function queryGenes(data = {}) {
        setLoading(true);
        fetch(process.env.REACT_APP_GRAPHQL_URI, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                setLoading(false);
                return(response.json());
            })
            .then((responseJson) => {
                setResponse(responseJson);
                setGenes(responseJson.data.genes);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // handle form submission and query GraphQL
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());

        setSelectedGenus(formJson.genus);
        setSelectedSpecies(formJson.species);
        setSelectedStrain(formJson.strain);

        const query = "query Query($identifier: String, $name: String, $description: String, $genus: String, $species: String, $strain: String, $geneFamilyIdentifier: String) { " +
              "genes(genus: $genus, species: $species, strain: $strain, identifier: $identifier, name: $name, description: $description, geneFamilyIdentifier: $geneFamilyIdentifier) { " +
              "name " +
              "identifier " +
              "description " +
              "organism { genus species } " +
              "strain { identifier } " +
              "geneFamilyAssignments { geneFamily { identifier } } " +
              "locations { chromosome { identifier } start end strand } " +
              "}}";
        
        queryGenes( {
            "query": query,
            "variables": {
                "genus": formJson.genus,
                "species": formJson.species,
                "strain": formJson.strain,
                "identifier": formJson.identifier,
                "name": formJson.name,
                "description": formJson.description,
                "geneFamilyIdentifier": formJson.geneFamilyIdentifier,
            },
            "operationName": "Query"
        });
    }

    // query GraphQL for the available species for a given genus
    function handleGenusSelection(e) {
        setSelectedGenus(e.target.value);
        getSpeciesList(e.target.value);
        setSelectedSpecies("");
        setSelectedStrain("");
        // setGenes(null);
    }

    function handleSpeciesSelection(e) {
        setSelectedSpecies(e.target.value);
        getStrainList(e.target.value);
        setSelectedStrain("");
        // setGenes(null);
    }

    function handleStrainSelection(e) {
        setSelectedStrain(e.target.value);
        // setGenes(null);
    }

    return (
        <div className="uk-padding">
          
          <h2 className="uk-heading-small">
            LIS Gene Search Demo (React, UIkit)
          </h2>

          <code>
            This demo is for search form and results design purposes only. Linkouts are not implemented. Pagination is not implemented.
          </code>

          <form className="uk-flex" method="post" onSubmit={handleSubmit}>
            <div className="uk-padding-small">
              <label className="uk-label">Genus</label><br/>
              <select className="uk-select uk-form-small" name="genus" value={selectedGenus}
                      onChange={e => handleGenusSelection(e)}>
                <option key={-1} value="">-- any --</option>
                {genusList.map((genus, index) => (
                    <option key={index} value={genus}>{genus}</option>
                ))}
              </select>
            </div>
            <div className="uk-padding-small">
              <label className="uk-label">species</label><br/>
              <select className="uk-select uk-form-small" name="species" value={selectedSpecies}
                      onChange={e => handleSpeciesSelection(e)}>
                <option key={-1} value="">-- any --</option>
                {selectedGenus && (
                    speciesList.map((species, index) => (
                        <option key={index} value={species}>{species}</option>
                    ))
                )}
              </select>
            </div>
            <div className="uk-padding-small">
              <label className="uk-label">accession</label><br/>
              <select className="uk-select uk-form-small" name="strain" value={selectedStrain}
                      onChange={e => handleStrainSelection(e)}>
                <option key={-1} value="">-- any --</option>
                {strainList && (
                    strainList.map((strain, index) => (
                        <option key={index} value={strain}>{strain}</option>
                    ))
                )}
              </select>
            </div>
            <div className="uk-padding-small">
              <label className="uk-label">identifier</label><br/>
              <input className="uk-input uk-form-small uk-form-width-medium" name="identifier"/><br/>
              <i>e.g. Glyma.13G357700</i>
            </div>
            <div className="uk-padding-small">
              <label className="uk-label">description</label><br/>
              <input className="uk-input uk-form-small uk-form-width-large" name="description"/><br/>
              <i>e.g. protein disulfide isomerase-like protein</i>
            </div>
            <div className="uk-padding-small">
              <label className="uk-label">gene family ID</label><br/>
              <input className="uk-input uk-form-small uk-form-width-small" name="geneFamilyIdentifier"/><br/>
              <i>e.g. L_HZ6G4Z</i>
            </div>
            <div className="uk-padding-small">
              <br/>
              <button className="uk-button uk-button-primary uk-form-small" type="submit">SEARCH</button>
            </div>
          </form>

          {loading && (
              <GlidingBlink/>
          )}

          {genes && (
              <div className="uk-padding">
                {genes.length ? (
                    genes.map((gene, index) => (
                        <div key={index}>
                          <div>
                            <b>{ gene.identifier }</b> ({ gene.name }) <span className="uk-text-italic">{ gene.organism.genus } { gene.organism.species }</span> { gene.strain.identifier }
                          </div>
                          <div className="uk-text-italic">
                            { gene.description }
                          </div>
                          {gene.locations[0] && gene.locations[0].chromosome && (
                              <div>
                                <b>location:</b> { gene.locations[0].chromosome.identifier }:{gene.locations[0].start}-{gene.locations[0].end} ({gene.locations[0].strand})
                              </div>
                          )}
                          {gene.geneFamilyAssignments[0] && (
                              <div>
                                <b>gene family:</b> { gene.geneFamilyAssignments[0].geneFamily.identifier }
                              </div>
                          )}
                          <hr className="uk-divider-icon"/>
                        </div>
                    ))
                ) : (
                    <div>
                      No results found.
                    </div>
                )}
              </div>
          )}
        </div>
    );
}

export default App;
