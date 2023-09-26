// App.js

import React, { useState, useEffect } from 'react';
import './styles.css'; // Import your CSS file here

function App() {
  const [studyData, setStudyData] = useState({
    cr: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
    ct: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
    dx: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
    mg: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
    mr: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
    us: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
    xa: { enabled: false, devices: '', studiesPerDay: '', studySizeMB: '' },
  });

  const [storageNeeded, setStorageNeeded] = useState({});
  const [totalStorageGB, setTotalStorageGB] = useState(0);
  const [calculationPeriod, setCalculationPeriod] = useState('oneYear'); // Default to one year

  useEffect(() => {
    const calculateStorageNeeded = () => {
      const storageNeededData = {};
      let totalStorage = 0;

      Object.keys(studyData).forEach((type) => {
        if (studyData[type].enabled) {
          const { devices, studiesPerDay, studySizeMB } = studyData[type];
          const weeksPerPeriod = calculationPeriod === 'oneYear' ? 52 : 26; // Adjust weeks based on calculationPeriod
          const studyStorageGB = ((devices * studiesPerDay * studySizeMB * 5 * weeksPerPeriod) / (1024 * 1024)) * 1000; // Convert MB to GB
          const formattedStorage = (Math.floor(studyStorageGB * 100) / 100); // Format storage as specified
          storageNeededData[type] = formattedStorage;
          totalStorage += formattedStorage; // Accumulate formattedStorage here
        }
      });

      setStorageNeeded(storageNeededData);
      setTotalStorageGB(totalStorage); // Set totalStorage to the accumulated value
    };

    calculateStorageNeeded();
  }, [studyData, calculationPeriod]);

  return (
    <div>
      <h1>PACS Storage Calculator</h1>
      <div>
        <label>
          Calculation Period:
          <select value={calculationPeriod} onChange={(e) => setCalculationPeriod(e.target.value)}>
            <option value="oneYear">One Year</option>
            <option value="sixMonths">Six Months</option>
          </select>
        </label>
      </div>
      <table className="table-concept"> {/* Add the CSS class for your table */}
        <thead>
          <tr>
            <th>Study Type</th>
            <th>Devices</th>
            <th>Studies/Day</th>
            <th>Study Size (MB)</th>
            <th>Total Storage (GB)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(studyData).map((type) => (
            <tr key={type}>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={studyData[type].enabled}
                    onChange={(e) =>
                      setStudyData({
                        ...studyData,
                        [type]: { ...studyData[type], enabled: e.target.checked },
                      })
                    }
                  />
                  {type}
                </label>
              </td>
              <td>
                <input
                  type="number"
                  value={studyData[type].devices === '' ? '' : studyData[type].devices}
                  onChange={(e) =>
                    setStudyData({
                      ...studyData,
                      [type]: {
                        ...studyData[type],
                        devices: e.target.value === '' ? '' : parseInt(e.target.value, 10) || '',
                      },
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={studyData[type].studiesPerDay === '' ? '' : studyData[type].studiesPerDay}
                  onChange={(e) =>
                    setStudyData({
                      ...studyData,
                      [type]: {
                        ...studyData[type],
                        studiesPerDay: e.target.value === '' ? '' : parseInt(e.target.value, 10) || '',
                      },
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={studyData[type].studySizeMB === '' ? '' : studyData[type].studySizeMB}
                  onChange={(e) =>
                    setStudyData({
                      ...studyData,
                      [type]: {
                        ...studyData[type],
                        studySizeMB: e.target.value === '' ? '' : parseInt(e.target.value, 10) || '',
                      },
                    })
                  }
                />
              </td>
              <td>{storageNeeded[type] || '0.00'} GB</td>
            </tr>
          ))}
          <tr>
            <td>Total</td>

            <td>{totalStorageGB.toFixed(2)} GB</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
