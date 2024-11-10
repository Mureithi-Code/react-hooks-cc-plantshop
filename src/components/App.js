import React, {useState, useEffect} from "react";
import Header from "./Header";
import PlantPage from "./PlantPage";

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('http://localhost:6001/plants')
    .then(r => {
      return r.json();
    })
    .then(data => {
      console.log(data);
      setPlants(data)
    })
    .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  const handleAddPlant = (newPlant) => {
    setPlants([...plants, newPlant]);

    fetch('http://localhost:6001/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPlant),
    })
    .then((r) => r.json())
    
    .then((newPlantFromServer) => {
      
      setPlants((prevPlants) =>
        prevPlants.map((plant) =>
        plant.id === newPlantFromServer.id ? newPlantFromServer : plant));
    })
    .catch((error) => {
      console.error("Error adding new plant:", error);
      setPlants((prevPlants) => prevPlants);
    });
  };

  const handleUpdateStock = (plantId, newInStockStatus) => {
    const updatedPlants = plants.map((plant) =>
    plant.id === plantId ? {...plant, inStock: newInStockStatus} : plant
  );

  setPlants(updatedPlants);
  
  const updatedPlant = updatedPlants.find((plant) => plant.id === plantId);

  fetch(`http://localhost:6001/plants/${plantId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({inStock: newInStockStatus})
  })
  .then(r => r.json())
  .then((updatedPlantFromServer) => {
    
  })
  .catch((error) => {
    console.error("Error updating plant stock:", error);
  });
  };

  const filteredPlants = plants.filter((plant) => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <Header />
      <PlantPage plants={filteredPlants} onAddPlant={handleAddPlant} onUpdateStock={handleUpdateStock} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );
}

export default App;
