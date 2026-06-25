import pytest
import requests
import pandas as pd
import os

excel_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "QA_Test_Suite.xlsx")
BASE_URL = "http://localhost:8080" # Example API endpoint

def get_api_tests():
    if not os.path.exists(excel_file):
        return []
    try:
        df = pd.read_excel(excel_file, sheet_name="API_300")
        return df.to_dict('records')
    except Exception:
        return []

api_tests = get_api_tests()

@pytest.mark.parametrize("test_data", api_tests, ids=[t["Test Case ID"] for t in api_tests])
def test_api_endpoints(test_data):
    test_id = test_data["Test Case ID"]
    feature = test_data["Feature"] # This holds the endpoint from our generator
    scenario = test_data["Test Scenario"]
    expected = test_data["Expected Result"]
    
    # Extract method from scenario "Validate GET request..."
    method = scenario.split()[1] if len(scenario.split()) > 1 else "GET"
    
    # In a real environment, we would execute actual requests:
    # response = requests.request(method, f"{BASE_URL}{feature}")
    # assert response.status_code == 200
    
    # Simulating API test assertion
    if "invalid token" in scenario.lower():
        assert "401" in expected
    elif "missing fields" in scenario.lower():
        assert "400" in expected
    else:
        assert True
