import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []
    with open(csv_file_path, 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            data.append(row)

    with open(json_file_path, 'w') as jsonfile:
        json.dump(data, jsonfile, separators=(',', ':'))

if __name__ == "__main__":
    csv_file_path = "processed_lines.csv"  # Replace with your CSV file path
    json_file_path = "processedScriptstrigify.json"  # Replace with your desired JSON output file path

    csv_to_json(csv_file_path, json_file_path)