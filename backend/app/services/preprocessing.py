import pandas as pd

def process_csv(file):
    df = pd.read_csv(file)
    df.fillna(0, inplace=True)
    return df
