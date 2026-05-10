const sendSuccess = (res, message, data = null) => {
    return res.status(200).json({ success: true, message, data });
}
const sendError = (res, message) => {
    return res.status(500).json({ success: false, message });
}
export { sendSuccess, sendError };