# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8.12

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY escape-game-server.yml .
COPY requirements.txt .
COPY ./endpoint.py .
COPY ./server/ .
# Install pip custom requirements
# RUN source /opt/miniconda/bin/activate

# RUN /opt/conda/bin/conda env create -f escape-game-server.yml
# SHELL ["conda", "run", "-n", "escape-game-server", "/bin/bash", "-c"]
RUN pip install -r requirements.txt
RUN pip install firebase-admin
RUN pip install git+https://github.com/fra31/auto-attack
RUN pip install git+https://github.com/RobustBench/robustbench.git@v0.2.1

# RUN /opt/conda/bin/conda install --file escape-game-server.yml
# RUN pip install firebase-admin
# RUN pip install google-cloud-firestore
# RUN python -m pip install -r requirements.txt
ADD config/* ./config/
# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
ENTRYPOINT ["python", "endpoint.py"]
# CMD ["python", "endpoint.py"]
