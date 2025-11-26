server {
listen 80 default_server;
listen [::]:80;
server_name syedasadhashmi.online www.syedasadhashmi.online;
return 301 https://$host$request_uri;

    }

server {

        listen 443 ssl;
    listen [::]:443 ssl;

    server_name syedasadhashmi.online www.syedasadhashmi.online;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    ssl_certificate /etc/letsencrypt/live/syedasadhashmi.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/syedasadhashmi.online/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

         location /api/ {
        proxy_pass http://localhost:7777;

        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }

        location / {
                try_files $uri /index.html;
        }

}
