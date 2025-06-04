import { useState } from 'react'
import './App.css'

interface AbaloneInput {
    Sex: string;
    Length: number;
    Diameter: number;
    Height: number;
    Whole_weight: number;
    Whole_weight_1: number;
    Whole_weight_2: number;
    Shell_weight: number;
}

interface PredictionResponse {
    predicted_rings: number;
}

function App() {
    const [formData, setFormData] = useState<AbaloneInput>({
        Sex: 'F',
        Length: 0.55,
        Diameter: 0.43,
        Height: 0.15,
        Whole_weight: 0.7715,
        Whole_weight_1: 0.3285,
        Whole_weight_2: 0.1465,
        Shell_weight: 0.24
    });

    const [prediction, setPrediction] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name === 'Sex' ? value : parseFloat(value)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to get prediction');
            }

            const result: PredictionResponse = await response.json();
            setPrediction(result.predicted_rings);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1>Abalone Age Predictor</h1>

            <div className="card">
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Sex:
                        <select
                            value={formData.Sex}
                            onChange={(e) => handleInputChange('Sex', e.target.value)}
                            style={{ marginLeft: '10px' }}
                        >
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                            <option value="I">Infant</option>
                        </select>
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Length:
                        <input
                            type="number"
                            value={formData.Length}
                            onChange={(e) => handleInputChange('Length', e.target.value)}
                            step="0.01"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Diameter:
                        <input
                            type="number"
                            value={formData.Diameter}
                            onChange={(e) => handleInputChange('Diameter', e.target.value)}
                            step="0.01"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Height:
                        <input
                            type="number"
                            value={formData.Height}
                            onChange={(e) => handleInputChange('Height', e.target.value)}
                            step="0.01"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Whole Weight:
                        <input
                            type="number"
                            value={formData.Whole_weight}
                            onChange={(e) => handleInputChange('Whole_weight', e.target.value)}
                            step="0.0001"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Shucked Weight:
                        <input
                            type="number"
                            value={formData.Whole_weight_1}
                            onChange={(e) => handleInputChange('Whole_weight_1', e.target.value)}
                            step="0.0001"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Viscera Weight:
                        <input
                            type="number"
                            value={formData.Whole_weight_2}
                            onChange={(e) => handleInputChange('Whole_weight_2', e.target.value)}
                            step="0.0001"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Shell Weight:
                        <input
                            type="number"
                            value={formData.Shell_weight}
                            onChange={(e) => handleInputChange('Shell_weight', e.target.value)}
                            step="0.0001"
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict Rings'}
                </button>

                {prediction !== null && (
                    <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                        Predicted Rings: {prediction}
                    </p>
                )}

                {error && (
                    <p style={{ marginTop: '20px', color: 'red' }}>
                        Error: {error}
                    </p>
                )}
            </div>

            <p className="read-the-docs">
                Enter abalone measurements to predict the number of rings (age)
            </p>
        </>
    )
}

export default App