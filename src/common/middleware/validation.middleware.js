import e from "express";

export const validation = (schema) => {
    return (req, res, next) => {
        let errorResult = [];
        for (const key of Object.keys(schema)) {
            // js is first callback error => abortEarly:false
            const { error } = schema[key].validate(req[key], { abortEarly: false });
            if (error) {
                error.details.forEach(err => {

                    errorResult.push(
                        {
                            key,
                            path: err.path[0],
                            message: err.message
                        }
                    );
                })
            }
        }
        if (errorResult.length > 0) {
            return res.status(400).json({ message: "validation error", error: errorResult });
        }
        next();
    }
}