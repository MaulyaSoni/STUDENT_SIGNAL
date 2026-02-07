import pandas as pd
import numpy as np
from typing import BinaryIO

def process_csv(file: BinaryIO) -> pd.DataFrame:
    """
    Process uploaded CSV file and prepare it for database insertion
    
    Args:
        file: Binary file object from upload
    
    Returns:
        DataFrame with processed student data
    """
    try:
        # Read CSV
        df = pd.read_csv(file)
        
        # Clean column names
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
        
        # Fill missing values
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        df[numeric_columns] = df[numeric_columns].fillna(0)
        
        # Fill string columns
        string_columns = df.select_dtypes(include=['object']).columns
        df[string_columns] = df[string_columns].fillna('')
        
        # Ensure required ML feature columns exist with defaults
        feature_defaults = {
            'attendance': 75.0,
            'internal_marks': 75.0,
            'backlogs': 0,
            'study_hours': 4.0,
            'previous_failures': 0,
            'gpa': 3.0,
            'semester': 1
        }
        
        for column, default_value in feature_defaults.items():
            if column not in df.columns:
                df[column] = default_value
        
        # Convert numeric fields to appropriate types
        if 'attendance' in df.columns:
            df['attendance'] = pd.to_numeric(df['attendance'], errors='coerce').fillna(75.0)
        
        if 'internal_marks' in df.columns:
            df['internal_marks'] = pd.to_numeric(df['internal_marks'], errors='coerce').fillna(75.0)
        
        if 'backlogs' in df.columns:
            df['backlogs'] = pd.to_numeric(df['backlogs'], errors='coerce').fillna(0).astype(int)
        
        if 'study_hours' in df.columns:
            df['study_hours'] = pd.to_numeric(df['study_hours'], errors='coerce').fillna(4.0)
        
        if 'previous_failures' in df.columns:
            df['previous_failures'] = pd.to_numeric(df['previous_failures'], errors='coerce').fillna(0).astype(int)
        
        if 'semester' in df.columns:
            df['semester'] = pd.to_numeric(df['semester'], errors='coerce').fillna(1).astype(int)
        
        if 'gpa' in df.columns:
            df['gpa'] = pd.to_numeric(df['gpa'], errors='coerce').fillna(3.0)
        
        # Validate ranges
        if 'attendance' in df.columns:
            df['attendance'] = df['attendance'].clip(0, 100)
        
        if 'internal_marks' in df.columns:
            df['internal_marks'] = df['internal_marks'].clip(0, 100)
        
        if 'study_hours' in df.columns:
            df['study_hours'] = df['study_hours'].clip(0, 24)
        
        if 'gpa' in df.columns:
            df['gpa'] = df['gpa'].clip(0, 4)
        
        return df
    
    except Exception as e:
        print(f"Error processing CSV: {str(e)}")
        raise ValueError(f"Failed to process CSV file: {str(e)}")
