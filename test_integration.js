const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

async function testIntegration() {
    console.log('🧪 Testing Node.js Backend and Python Microservice Integration...\n');
    
    // Test 1: Check if Node.js backend is running
    console.log('1. Testing Node.js backend...');
    try {
        const response = await fetch('http://localhost:5000/');
        const text = await response.text();
        console.log('✅ Node.js backend is running:', text);
    } catch (error) {
        console.log('❌ Node.js backend is not running:', error.message);
        return;
    }
    
    // Test 2: Check if Python microservice is running
    console.log('\n2. Testing Python microservice...');
    try {
        const response = await fetch('http://localhost:8000/process-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Test text', filename: 'test.txt' })
        });
        const result = await response.json();
        console.log('✅ Python microservice is running:', result);
    } catch (error) {
        console.log('❌ Python microservice is not running:', error.message);
        return;
    }
    
    // Test 3: Test the full integration
    console.log('\n3. Testing full integration...');
    try {
        // Create a simple test file
        fs.writeFileSync('test_upload.txt', 'This is a test legal document for analysis.');
        
        const form = new FormData();
        form.append('files', fs.createReadStream('test_upload.txt'));
        
        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: form
        });
        
        const result = await response.json();
        console.log('✅ Full integration test successful:', result);
        
        // Clean up
        fs.unlinkSync('test_upload.txt');
        
    } catch (error) {
        console.log('❌ Full integration test failed:', error.message);
    }
    
    console.log('\n🎉 Integration test completed!');
}

testIntegration();
