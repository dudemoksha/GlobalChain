import pandas as pd
import random
from datetime import datetime
import os

# Define application specifics for GlobalChain
MODULES = ["Auth", "Dashboard", "Globe Visualization", "Disaster Intelligence", "Predictive Engine", "Propagation Engine", "Suppliers", "Admin", "Analytics"]
BROWSERS = ["Chrome", "Firefox", "Edge", "Safari"]
DEVICES = ["Pixel 7", "Galaxy S23", "iPhone 15", "Tablet"]
API_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]
API_ENDPOINTS = ["/api/v1/auth", "/api/v1/disaster-intel", "/api/v1/globe-data", "/api/v1/suppliers", "/api/v1/predictive", "/api/v1/admin/users", "/api/v1/propagation"]
ENVIRONMENTS = ["Staging", "QA", "Production"]

def generate_selenium_tests(count):
    data = []
    features = ["Login", "Navigation", "Form Submission", "Data Render", "Map Interaction", "Simulation Play", "Upload", "Download Report"]
    for i in range(1, count + 1):
        module = random.choice(MODULES)
        feature = random.choice(features)
        status = "Pending"
        data.append([
            f"SEL_{i:03d}", module, feature, f"Verify {feature} in {module} module", 
            f"User is logged in, on {module} page", f"1. Navigate to {module}\n2. Perform {feature}", 
            f"System should successfully execute {feature} on {module}", "", status, "", "", 
            random.choice(["High", "Medium", "Low"]), random.choice(["Critical", "Major", "Minor"]), "Auto-Bot", 
            random.choice(ENVIRONMENTS), "", "", ""
        ])
    return data

def generate_appium_tests(count):
    data = []
    features = ["Launch App", "Swipe", "Pull to Refresh", "Tap Map Node", "Offline Mode", "Background Resume", "Screen Rotation", "Push Notification"]
    for i in range(1, count + 1):
        module = random.choice(MODULES)
        feature = random.choice(features)
        device = random.choice(DEVICES)
        data.append([
            f"APP_{i:03d}", module, feature, f"Validate {feature} on {device} for {module}", 
            f"App installed on {device}", f"1. Open App\n2. Do {feature} in {module}", 
            f"{feature} must work seamlessly on {device}", "", "Pending", "", "", 
            random.choice(["High", "Medium"]), random.choice(["Critical", "Major"]), "Auto-Bot", 
            random.choice(ENVIRONMENTS), "", "", ""
        ])
    return data

def generate_api_tests(count):
    data = []
    for i in range(1, count + 1):
        method = random.choice(API_METHODS)
        endpoint = random.choice(API_ENDPOINTS)
        scenario = f"Validate {method} request to {endpoint}"
        if random.random() > 0.8:
            scenario += " with invalid token"
            expected = "401 Unauthorized"
        elif random.random() > 0.8:
            scenario += " with missing fields"
            expected = "400 Bad Request"
        else:
            expected = "200/201 Success Response with valid schema"

        data.append([
            f"API_{i:03d}", "Backend Services", endpoint, scenario, 
            "API service is running", f"1. Send {method} to {endpoint}", 
            expected, "", "Pending", "", "", 
            "High", "Major", "Auto-Bot", random.choice(ENVIRONMENTS), "", "", ""
        ])
    return data

def generate_validation_tests(count):
    data = []
    validation_types = ["SQL Injection", "XSS", "Boundary Value", "Null Input", "Max Length Exceeded", "Invalid Date Format", "Unauthorized Role Access"]
    for i in range(1, count + 1):
        module = random.choice(MODULES)
        val_type = random.choice(validation_types)
        data.append([
            f"VAL_{i:03d}", module, "Security & Input", f"Check {val_type} on {module} inputs", 
            "System is accessible", f"1. Input {val_type} payload\n2. Submit", 
            "System should reject payload and show correct error", "", "Pending", "", "", 
            "High", "Critical", "Auto-Bot", random.choice(ENVIRONMENTS), "", "", ""
        ])
    return data

def generate_performance_tests(count):
    data = []
    perf_types = ["100 Concurrent Users", "Spike 500 Users", "Endurance 24hr", "Globe Node Render 10k", "Large File Upload", "Simulation Compute"]
    for i in range(1, count + 1):
        module = random.choice(MODULES)
        perf = random.choice(perf_types)
        data.append([
            f"PERF_{i:03d}", module, "Load & Stress", f"Test {perf} on {module}", 
            "System under normal load", f"1. Inject {perf} load\n2. Monitor metrics", 
            "Response time < 2s, CPU < 80%", "", "Pending", "", "", 
            "High", "Major", "Auto-Bot", random.choice(ENVIRONMENTS), "", "", ""
        ])
    return data

def main():
    columns = [
        "Test Case ID", "Module", "Feature", "Test Scenario", "Preconditions", 
        "Test Steps", "Expected Result", "Actual Result", "Status", "Execution Time", 
        "Execution Date", "Priority", "Severity", "Tester", "Environment", 
        "Screenshot/Log Path", "Defect ID", "Remarks"
    ]

    print("Generating 1500 Application-Specific Test Cases...")
    
    # Generate 300 rows for each category
    selenium_data = generate_selenium_tests(300)
    appium_data = generate_appium_tests(300)
    api_data = generate_api_tests(300)
    validation_data = generate_validation_tests(300)
    performance_data = generate_performance_tests(300)
    
    # Create master report empty structure
    master_data = [
        ["Total Test Cases", 1500],
        ["Passed", 0],
        ["Failed", 0],
        ["Skipped", 0],
        ["Blocked", 0],
        ["Pass Percentage", "0%"],
        ["Execution Duration", "0s"]
    ]

    # Save to Excel
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "QA_Test_Suite.xlsx")
    
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        pd.DataFrame(selenium_data, columns=columns).to_excel(writer, sheet_name="Selenium_300", index=False)
        pd.DataFrame(appium_data, columns=columns).to_excel(writer, sheet_name="Appium_300", index=False)
        pd.DataFrame(api_data, columns=columns).to_excel(writer, sheet_name="API_300", index=False)
        pd.DataFrame(validation_data, columns=columns).to_excel(writer, sheet_name="Validation_300", index=False)
        pd.DataFrame(performance_data, columns=columns).to_excel(writer, sheet_name="Performance_300", index=False)
        pd.DataFrame(master_data, columns=["Metric", "Value"]).to_excel(writer, sheet_name="Master_Report", index=False)
        
    print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    main()
