Get the last deployment version from yaml file on gcp. Increment this & use it for next docker image.

Update Properties
========================
1.)Update the url property in \revenue-cycle\revenue-cycle-ui\src\environments file to IP address of API container

Build Docker Image
========================
docker build -t revenue-cycle-ui:1.0.34 .

Run New Build Image
========================
docker run -it --rm --name revenue-dev-ui -d -p 5200:5200 revenue-cycle-ui:1.0.34

Tag New Build Image
========================
docker tag revenue-cycle-ui:1.0.34 gcr.io/revenuecycle/revenue-cycle-ui:1.0.34

Push The Image in Repos
========================
docker push gcr.io/revenuecycle/revenue-cycle-ui:1.0.34

Update the yaml file in gcp for current version