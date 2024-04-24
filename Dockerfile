# Make sure you have an updated production build by issuing:
#   ```
#   docker build -t react-microblog .
#   ```
#
# Launch a container based on the image by issuing:
#   ```
#   docker run --publish 8080:80 --name microblog --detach react-microblog
#   ```

FROM nginx

COPY build/ /usr/share/nginx/html/
