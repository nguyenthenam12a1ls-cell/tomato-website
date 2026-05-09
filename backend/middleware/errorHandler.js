const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.json({ success: false, message: err.message || "Lỗi" });
}

export default errorHandler;