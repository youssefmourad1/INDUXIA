// Call the edge function to create demo accounts
fetch('https://dcfhbehfficqizdncgwy.supabase.co/functions/v1/create-demo-accounts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({})
})
.then(response => response.json())
.then(data => console.log('Demo accounts created:', data))
.catch(error => console.error('Error creating demo accounts:', error));