FROM nginx:alpine
COPY . /usr/share/nginx/html
# Copia a nossa configuração que resolve o erro de rota SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]