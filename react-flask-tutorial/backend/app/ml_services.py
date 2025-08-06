# backend/app/ml_services.py
import os
import numpy
from PIL import Image
from .neural_network_class import neuralNetwork # 从同级目录导入神经网络类

class DigitRecognizerService:
    """封装手写数字识别模型的加载和预测逻辑"""

    def __init__(self):
        # 定义模型路径和架构
        self.model_path = os.path.join('saved_model', 'trained_weights.npz')
        self.input_nodes = 784
        self.hidden_nodes = 200
        self.output_nodes = 10
        self.learning_rate = 0.1 # 虽然预测用不到，但初始化类需要
        
        # 加载模型
        self.model = self._load_model()

    def _load_model(self):
        """私有方法，用于加载模型"""
        if not os.path.exists(self.model_path):
            print(f"错误: 找不到模型文件 '{self.model_path}'")
            return None
        
        print("正在加载手写数字识别模型...")
        nn = neuralNetwork(
            inputnodes=self.input_nodes,
            hiddennodes=self.hidden_nodes,
            outputnodes=self.output_nodes,
            learningrate=self.learning_rate
        )
        nn.load_weights(self.model_path)
        print("模型加载成功。")
        return nn

    def predict(self, image_file):
        """
        对上传的图片文件进行预处理和预测。
        :param image_file: 通过 Flask request.files 获取的文件对象
        :return: 包含预测结果和置信度的字典
        """
        if not self.model:
            return {"error": "模型未加载，无法进行预测"}

        try:
            # 预处理图片
            img = Image.open(image_file).convert('L') # 转为灰度图
            img = img.resize((28, 28), Image.Resampling.LANCZOS)
            
            img_data = numpy.asarray(img)
            img_data_inverted = 255.0 - img_data # 反转颜色 (黑底白字 -> 白底黑字)
            scaled_input = (img_data_inverted / 255.0 * 0.99) + 0.01
            image_vector = scaled_input.flatten() # 展平为一维向量
            
            # 使用模型进行预测
            outputs = self.model.query(image_vector)
            
            # 准备返回结果
            prediction = int(numpy.argmax(outputs))
            confidences = {str(i): float(prob) for i, prob in enumerate(outputs.flatten())}
            
            return {
                "prediction": prediction,
                "confidences": confidences
            }
        except Exception as e:
            return {"error": f"图片处理或预测时出错: {e}"}