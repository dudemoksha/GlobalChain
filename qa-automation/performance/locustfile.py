from locust import HttpUser, task, between

class GlobalChainPerfUser(HttpUser):
    wait_time = between(1, 5)
    
    def on_start(self):
        # Setup logic like logging in and getting a token
        pass

    @task(3)
    def view_dashboard(self):
        self.client.get("/api/v1/analytics")

    @task(1)
    def render_globe_data(self):
        # Simulating heavy payload fetch for globe visualization
        self.client.get("/api/v1/globe-data")
        
    @task(2)
    def check_disaster_intel(self):
        self.client.get("/api/v1/disaster-intel")
        
    @task(1)
    def compute_simulation(self):
        self.client.post("/api/v1/predictive", json={"node_count": 5000})

# To run this dynamically from our generated test suite, we'll invoke locust in headless mode
# locust -f qa-automation/performance/locustfile.py --headless -u 100 -r 10 -t 30s
