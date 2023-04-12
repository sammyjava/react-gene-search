import { useEffect, useState } from 'react';

export function GeneResult({ gene }) {

    const [isHoveringOnGene, setIsHoveringOnGene] = useState(false);

    const handleGeneMouseOver = () => {
        setIsHoveringOnGene(true);
    };
    const handleGeneMouseOut = () => {
        setIsHoveringOnGene(false);
    };
    
    return (
        <div>
          {isHoveringOnGene && (
              <div className="gene-linkout">
                This is a stub to represent the linkout service for gene identifier: {gene.identifier}
              </div>
          )}
          <div onMouseOver={handleGeneMouseOver} onMouseOut={handleGeneMouseOut}>
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
    );
}
    
