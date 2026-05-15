import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tomato Food Delivery API',
            version: '1.0.0',
            description: 'Tài liệu API cho dự án Tomato Website',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Đường dẫn tới các file chứa ghi chú API (chúng ta sẽ ghi chú ngay trong Route hoặc Controller)
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
export default specs;
