import csv
import json

def convert_csv_to_json(csv_file_path, json_file_path):
    """
    Converts city data from a CSV file to a JSON file.

    Args:
        csv_file_path (str): The path to the input CSV file.
        json_file_path (str): The path to the output JSON file.
    """
    cities_list = []
    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                try:
                    city_data = {
                        "id": row["city_id"], # Keep as string or convert to int if preferred
                        "name": row["city_name"],
                        "country": row["country_full"],
                        "lat": float(row["lat"]),
                        "lon": float(row["lon"])
                    }
                    cities_list.append(city_data)
                except KeyError as e:
                    print(f"Warning: Missing expected column {e} in a row. Skipping row: {row}")
                except ValueError as e:
                    print(f"Warning: Could not convert lat/lon to float for row. Skipping row: {row}. Error: {e}")

        with open(json_file_path, mode='w', encoding='utf-8') as json_file:
            json.dump(cities_list, json_file, indent=2) # indent for pretty printing

        print(f"Successfully converted {csv_file_path} to {json_file_path}")
        print(f"Total cities processed: {len(cities_list)}")

    except FileNotFoundError:
        print(f"Error: The file {csv_file_path} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    # --- Configuration ---
    input_csv_file = 'cities_data.csv'  # Name of your input CSV file
    # Output to the public folder so Vue can fetch it easily
    output_json_file = '/home/selira/timeApp/public/cities.json'
    # --- End Configuration ---

    convert_csv_to_json(input_csv_file, output_json_file)