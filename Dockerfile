FROM nginx:mainline-alpine

COPY /hosting/nginx-site.conf /etc/nginx/conf.d/default.conf
COPY /dist /var/www/html
RUN rm /var/www/html/report.html