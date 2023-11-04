import crypto from 'crypto';

const hash = (data: string) : string => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

export default hash;