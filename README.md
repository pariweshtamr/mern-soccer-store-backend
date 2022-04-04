This backend api project is created for the soccer-store ecommerce.

API end points

All the API will be followed by \${rootUrl}/api/v1
USER API end point

All user api endpoint will be followed by \${rootUrl}/api/v1/user
|# | API |METHOD | DESCRIPTION
|--|------------|-------|------------------
|1. |/ | GET | Get all user
|2. |/ | POST | Create new user in database

Catalog API end point

All user api endpoint will be followed by \${rootUrl}/api/v1/category

# API METHOD DESCRIPTION

1.        /:_id? 	GET 	Get single category if _id is provided, else return all categories
2.        / 	POST 	Create new category in database
3.        / 	PATCH 	Update existing category in database
4.        /:_id? 	DELETE 	delete category from database
