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

# Replace the default/stock Nginx configuration,
# which is part of the base image,
# with a custom Nginx configuration that uses the most appropriate settings
# for the production-build files of the React application.
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
