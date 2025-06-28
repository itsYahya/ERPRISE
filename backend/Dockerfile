FROM python:3

WORKDIR /backend

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Copy configuration first
COPY ./conf/ .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./src/ api/

# Make script executable with explicit permissions and line endings
RUN chmod +x ./script.sh && \
    sed -i 's/\r$//' ./script.sh

# Run the script
CMD ["/bin/bash", "./script.sh"]