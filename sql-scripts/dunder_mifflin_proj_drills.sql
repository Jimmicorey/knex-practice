--1. How many people work in the Sales department?

    --    full_name    | department 
    -- ----------------+------------
    --  Michael Scott  | Sales
    --  Dwight Schrute | Sales
    --  Jim Halpert    | Sales
    --  Pam Beasley    | Sales
    -- (4 rows)

SELECT
e.emp_name as Full_Name,
d.dept_name as Department
FROM
employee e
INNER JOIN
department d
ON e.department = d.id
WHERE
d.dept_name = 'Sales';


------------------------------------
--for just a number of employees...

    --  count 
    -- -------
    --      4
    -- (1 row)

SELECT
COUNT(e.id)
FROM
employee e
JOIN
department d
ON e.department = d.id
WHERE
d.dept_name = 'Sales';


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

--2. List the names of all employees assigned to the 'Plan Christmas party' project.

    --     full_name    |       project        
    -- -----------------+----------------------
    --  Toby Flenderson | Plan christmas party
    -- (1 row)

SELECT
e.emp_name as Full_Name,
p.project_name as Project
FROM
employee e
JOIN
employee_project ep
ON e.id = ep.emp_id
JOIN
project p
ON ep.project_id = p.id
WHERE p.project_name = 'Plan christmas party';


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

--3. List the names of employees from the Warehouse department that are assigned to the 'Watch paint dry' project.

    --  full_name | project_name | department 
    -- -----------+--------------+------------
    -- (0 rows)

SELECT
e.emp_name as Full_Name,
p.project_name as Project_Name,
d.dept_name as Department
FROM
employee e
JOIN
employee_project ep 
ON e.id = ep.emp_id
JOIN 
project p
ON p.id = ep.project_id
JOIN
department d
ON e.department = d.id
WHERE 
p.project_name = 'Plan christmas party'
AND
d.dept_name = 'Warehouse';


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

--4. Which projects are the Sales department employees assigned to?

    --    full_name    | department |     project     
    -- ----------------+------------+-----------------
    --  Michael Scott  | Sales      | Watch paint dry
    --  Dwight Schrute | Sales      | Watch paint dry
    --  Jim Halpert    | Sales      | Watch paint dry
    --  Pam Beasley    | Sales      | Watch paint dry
    -- (4 rows)

SELECT
e.emp_name as Full_Name,
d.dept_name as Department,
p.project_name as Project
FROM
employee e
JOIN
department d
ON e.department = d.id
JOIN
employee_project ep
ON ep.emp_id = e.id
JOIN
project p
ON p.id = ep.project_id
WHERE
d.dept_name = 'Sales';


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

--5. List only the managers that are assigned to the 'Watch paint dry' project.

    --   full_name  | department_manager |     project     
    -- -------------+--------------------+-----------------
    --  Jim Halpert | Sales              | Watch paint dry
    -- (1 row)

SELECT
e.emp_name as full_name,
d.dept_name as department_manager,
p.project_name as project
FROM
employee e
JOIN
department d
ON e.department = d.id
JOIN
employee_project ep
ON ep.emp_id = e.id
JOIN
project p
ON ep.project_id = p.id
WHERE
p.project_name = 'Watch paint dry'
AND
d.manager = e.id;