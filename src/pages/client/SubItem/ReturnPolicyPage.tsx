const ReturnPolicyPage = () => {
  return (
    <div className="max-w-[768px] md:max-w-[1024px] lg:max-w-[1280px] mx-auto pt-46 md:pt-[155px] space-y-10 p-3">
      <h1 className="text-2xl md:text-3xl  font-bold text-[#F84563] text-center">
        Chính sách đổi trả hàng
      </h1>

      <div>
        <p className="text-gray-800 md:text-lg leading-relaxed">
          Khi sử dụng dịch vụ đặt hàng Trung Quốc, quý khách cần nắm rõ quy định
          chính sách đổi trả hàng của chúng tôi. Giúp việc mua hàng trở nên dễ
          dàng khi quý khách hàng nắm rõ các chính sách của chúng tôi.
        </p>
      </div>

      {/* Trường hợp 1: Lỗi do BTC Logistics */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#F84563] mb-2">
          Trường hợp 1: Do lỗi dịch vụ của BTC Logistics
        </h2>
        <p className="text-gray-800 md:text-lg leading-relaxed mb-2">
          Trường hợp lỗi do dịch vụ của BTC Logistics, quý khách hàng vẫn chấp nhận
          đồng ý nhận hàng, thanh lý hộ thì BTC Logistics sẽ có chính sách hỗ trợ cho
          khách hàng trên đơn hàng đó.
        </p>
        <p className="text-gray-800 md:text-lg leading-relaxed">
          Việc nhận hàng sẽ được thực hiện tại VPGD của BTC Logistics. Sau khi nhận
          hàng, chúng tôi sẽ hoàn lại tiền cho Quý khách & chủ động trả lại hàng
          cho nhà cung cấp (NCC) nếu cần.
        </p>
      </div>

      {/* Trường hợp 2: Lỗi do NCC */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#F84563] mb-2">
          Trường hợp 2: Do lỗi của nhà cung cấp (NCC)
        </h2>
        <p className="text-gray-800 md:text-lg leading-relaxed mb-2">
          Lỗi sai được phát hiện từ thời điểm kiểm hàng & khách không đồng ý
          nhận hàng lỗi. BTC Logistics sẽ làm việc với NCC để trả hàng & hoàn tiền cho
          khách ngay khi NCC hoàn tiền cho BTC Logistics.
        </p>
        <p className="text-gray-800 md:text-lg leading-relaxed mb-2">
          Lỗi sai được phát hiện khi khách nhận hàng & không nằm trong phạm vi
          dịch vụ kiểm hàng của chúng tôi, BTC Logistics sẽ thực hiện nhận lại hàng
          sau khi đã liên lạc với NCC & NCC đồng ý việc trả lại hàng.
        </p>
        <p className="text-gray-800 md:text-lg leading-relaxed">
          Phí đổi trả hàng do khách hàng chi trả.
        </p>
      </div>

      {/* Trường hợp 3: Khách không ưng ý */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#F84563] mb-2">
          Trường hợp 3: Đổi trả hàng nếu khách không ưng ý
        </h2>
        <p className="text-gray-800 md:text-lg leading-relaxed mb-2">
          Chính sách mới duy nhất tại BTC Logistics, được áp dụng từ 01/06/2018 cho
          tất cả khách hàng của BTC Logistics. Trường hợp khách nhận hàng, nhưng không
          ưng ý (không có lỗi từ NCC, đơn vị vận chuyển hay BTC Logistics), chúng tôi
          vẫn hỗ trợ quý khách liên hệ nhà cung cấp (NCC) để đổi trả hàng.
        </p>
        <p className="text-gray-800 md:text-lg leading-relaxed mb-2">
          Trong trường hợp đổi trả hàng theo mong muốn của Quý khách, không xuất
          phát từ lỗi của nhà cung cấp:
        </p>
        <ul className="list-disc list-inside space-y-2 md:text-lg text-gray-800">
          <li className="hover:text-[#F84563] ">
            Hỗ trợ tối đa cho Quý khách để đổi trả hàng cho nhà cung cấp (NCC),
            tuy nhiên chúng tôi không cam kết hàng sẽ được đổi trả (bị phụ thuộc
            vào nhà cung cấp).
          </li>
          <li className="hover:text-[#F84563] ">Quý khách chịu 100% chi phí đổi trả hàng.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
