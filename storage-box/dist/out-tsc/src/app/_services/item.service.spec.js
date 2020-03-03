import { TestBed } from '@angular/core/testing';
import { ItemService } from './item.service';
describe('ItemService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = TestBed.get(ItemService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=item.service.spec.js.map