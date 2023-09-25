import {describe, expect, test} from '@jest/globals';

import TreeNode from '../src/node';
import SegmentTree from '../src/segment_tree'

describe('SegmentTree as Max', () => {
    let merge = (...numbers: number[]) => Math.max(...numbers);
    let segmentTree = new SegmentTree<number>(merge);
    let node = new TreeNode<number>(merge());

    it('should be initialized', () => {
        expect(segmentTree.query(node, 0, 31, 0, 31)).toBe(-Infinity);
        expect(segmentTree.default).toBe(-Infinity);
    });

    it('should return non initialized value after upated', () => {
        segmentTree.update(node, 0, 31, 0, 1);
        expect(segmentTree.query(node, 0, 31, 0, 31)).toBe(1);
        expect(segmentTree.query(node, 0, 31, 15, 31)).toBe(-Infinity);
        segmentTree.update(node, 0, 31, 1, 3);
        expect(segmentTree.query(node, 0, 31, 0, 31)).toBe(3);
        segmentTree.update(node, 0, 31, 2, 2);
        expect(segmentTree.query(node, 0, 31, 0, 31)).toBe(3);
    });
});
