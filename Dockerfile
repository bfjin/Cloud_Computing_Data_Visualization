FROM ubuntu:xenial

RUN apt-get update
RUN apt-get install -y software-properties-common python-pip python-dev build-essential
RUN pip install --upgrade pip
RUN pip install django
RUN mkdir -p /root/comp90024_cloud_computing_data_visualization

ADD dist /root/comp90024_cloud_computing_data_visualization/
ADD Dockerfile /root/comp90024_cloud_computing_data_visualization/

WORKDIR /root/comp90024_cloud_computing_data_visualization

EXPOSE 8000

CMD python manage.pyc runserver 0.0.0.0:8000