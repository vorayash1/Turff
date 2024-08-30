import React, { useState } from 'react';
import './demo.css'; // Import your CSS file for styling

const ConfigurableBed = () => {
    // State variables for bed configuration
    const [bedSize, setBedSize] = useState('Queen');
    const [mattressType, setMattressType] = useState('Memory Foam');
    const [color, setColor] = useState('White');
    const [isHeadboardIncluded, setHeadboardIncluded] = useState(false);

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can implement logic to handle the submitted configuration
        console.log('Submitted:', { bedSize, mattressType, color, isHeadboardIncluded });
    };

    return (
        <div className="configurable-bed">
            <h2>Configure Your Bed</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="bedSize">Bed Size:</label>
                    <select id="bedSize" value={bedSize} onChange={(e) => setBedSize(e.target.value)}>
                        <option value="Twin">Twin</option>
                        <option value="Full">Full</option>
                        <option value="Queen">Queen</option>
                        <option value="King">King</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="mattressType">Mattress Type:</label>
                    <select id="mattressType" value={mattressType} onChange={(e) => setMattressType(e.target.value)}>
                        <option value="Memory Foam">Memory Foam</option>
                        <option value="Innerspring">Innerspring</option>
                        <option value="Latex">Latex</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="color">Color:</label>
                    <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>
                        <input type="checkbox" checked={isHeadboardIncluded} onChange={(e) => setHeadboardIncluded(e.target.checked)} />
                        Include Headboard
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="bed-demo">
                {/* Replace the image URLs with your own */}
                <img src="https://img.freepik.com/premium-vector/handy-isometric-icon-modern-bed_9206-10833.jpg?w=740" alt="Bed Demo" />
            </div>
        </div>
    );
};

export default ConfigurableBed;
