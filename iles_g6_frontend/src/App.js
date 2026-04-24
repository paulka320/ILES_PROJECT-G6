import  {BrowserRouter}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Login />} />
          <Route path = "/dashboard" element = {
            <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>
          }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
